# == Schema Information
#
# Table name: group_accounts
#
#  id                :bigint(8)        not null, primary key
#  group_id          :bigint(8)        not null
#  account_id        :bigint(8)        not null
#  write_permissions :boolean          default(FALSE), not null
#  role              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  unread_count      :integer          default(0)
#

class GroupAccount < ApplicationRecord
  enum role: { admin: "admin" }

  belongs_to :group
  belongs_to :account

  validates :account_id, uniqueness: { scope: :group_id }

  after_commit :remove_relationship_cache
  after_create :increment_member_count
  after_destroy :decrement_member_count

  private

  def remove_relationship_cache
    Rails.cache.delete("relationship:#{account_id}:group#{group_id}")
  end

  def increment_member_count
    group&.increment!(:member_count)
  end

  def decrement_member_count
    group&.decrement!(:member_count)
  end
end
