class Settings::Verifications::ModerationController < Admin::BaseController
	def index
		@verification_requests = AccountVerificationRequest.all
	end

	def approve
		verification_request = AccountVerificationRequest.find params[:id]
		
		# Mark user as verified
		account = verification_request.account
		account.is_verified = true
		account.save()

		# Notify user
		UserMailer.verification_approved(account.user).deliver_later!

		# Remove all traces
		verification_request.destroy()

		# Redirect back to the form with a proper message
		redirect_to settings_verifications_moderation_url, notice: I18n.t('verifications.moderation.approved_msg')
	end

	def reject
		@verification_requests = AccountVerificationRequest.find params[:id]
	end
end
