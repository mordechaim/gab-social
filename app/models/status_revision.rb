# == Schema Information
#
# Table name: status_revisions
#
#  id         :bigint(8)        not null, primary key
#  status_id  :bigint(8)
#  text       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class StatusRevision < ApplicationRecord
end
