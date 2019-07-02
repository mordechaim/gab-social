class Settings::Verifications::RequestsController < Settings::BaseController
	include Authorization

	layout 'admin'
	before_action :authenticate_user!

	def index
		@account_verification_request = AccountVerificationRequest.where(account: current_account)[0] || AccountVerificationRequest.new
	end

	def create
      authorize :account_verification_request, :create?

      # POST requests didn't work with only binary input under account_verification_request tag
      # Acts like dict input is empty
      params = resource_params
      params['account'] = current_account

      @account_verification_request = AccountVerificationRequest.new(params)

      if @account_verification_request.save
        redirect_to settings_verifications_requests_path, notice: I18n.t('verifications.requests.created_msg')
      else
        render :index
      end
    end

    def resource_params
      params.require(:account_verification_request).permit(:image)
    end
end
