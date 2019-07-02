# == Schema Information
#
# Table name: account_verification_requests
#
#  id                 :bigint(8)        not null, primary key
#  account_id         :bigint(8)
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :bigint(8)
#  image_updated_at   :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class AccountVerificationRequest < ApplicationRecord
	LIMIT            = 4.megabytes
	IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].freeze

	belongs_to :account

	has_attached_file :image
	validates_attachment :image, presence: true
	validates_attachment_content_type :image, content_type: IMAGE_MIME_TYPES
	validates_attachment_size :image, less_than: LIMIT
	remotable_attachment :image, LIMIT
end
