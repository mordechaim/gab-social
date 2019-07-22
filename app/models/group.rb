# == Schema Information
#
# Table name: groups
#
#  id                       :bigint(8)        not null, primary key
#  account_id               :bigint(8)
#  title                    :string           not null
#  description              :string           not null
#  cover_image_file_name    :string
#  cover_image_content_type :string
#  cover_image_file_size    :integer
#  cover_image_updated_at   :datetime
#  is_nsfw                  :boolean          default(FALSE), not null
#  is_featured              :boolean          default(FALSE), not null
#  is_archived              :boolean          default(FALSE), not null
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  member_count             :integer          default(0)
#

class Group < ApplicationRecord
  include Paginable
  include GroupInteractions
  include GroupCoverImage

  PER_ACCOUNT_LIMIT = 50

  belongs_to :account, optional: true

  has_many :group_accounts, inverse_of: :group, dependent: :destroy
  has_many :accounts, through: :group_accounts

  has_many :group_removed_accounts, inverse_of: :group, dependent: :destroy
  has_many :removed_accounts, source: :account, through: :group_removed_accounts

  validates :title, presence: true
  validates :description, presence: true

  validates_each :account_id, on: :create do |record, _attr, value|
    record.errors.add(:base, I18n.t('groups.errors.limit')) if Group.where(account_id: value).count >= PER_ACCOUNT_LIMIT
  end

  before_destroy :clean_feed_manager
  after_create :add_owner_to_accounts

  private

  def add_owner_to_accounts
    group_accounts << GroupAccount.new(account: account, role: :admin, write_permissions: true)
  end

  def clean_feed_manager
    reblog_key       = FeedManager.instance.key(:group, id, 'reblogs')
    reblogged_id_set = Redis.current.zrange(reblog_key, 0, -1)

    Redis.current.pipelined do
      Redis.current.del(FeedManager.instance.key(:group, id))
      Redis.current.del(reblog_key)

      reblogged_id_set.each do |reblogged_id|
        reblog_set_key = FeedManager.instance.key(:group, id, "reblogs:#{reblogged_id}")
        Redis.current.del(reblog_set_key)
      end
    end
  end
end
