# == Schema Information
#
# Table name: promotions
#
#  id          :bigint(8)        not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  expires_at  :datetime
#  status_id   :bigint(8)        not null
#  timeline_id :string
#  position    :integer          default(10)
#

class Promotion < ApplicationRecord
    belongs_to :status
    
    scope :active, -> { where('expires_at > ?', [Time.now]) }
end
