# == Schema Information
#
# Table name: group_removed_accounts
#
#  id         :bigint(8)        not null, primary key
#  group_id   :bigint(8)        not null
#  account_id :bigint(8)        not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class GroupRemovedAccount < ApplicationRecord
  belongs_to :group
  belongs_to :account
end
