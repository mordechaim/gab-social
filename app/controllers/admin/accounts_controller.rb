# frozen_string_literal: true

module Admin
  class AccountsController < BaseController
    before_action :set_account, only: [:show, :subscribe, :unsubscribe, :redownload, :remove_avatar, :remove_header, :enable, :unsilence, :unsuspend, :memorialize, :approve, :reject, :verify, :unverify, :add_donor_badge, :remove_donor_badge, :add_investor_badge, :remove_investor_badge, :edit_pro, :save_pro, :edit, :update]
    before_action :require_remote_account!, only: [:subscribe, :unsubscribe, :redownload]
    before_action :require_local_account!, only: [:enable, :memorialize, :approve, :reject]

    def index
      authorize :account, :index?
      @accounts = filtered_accounts.page(params[:page])
    end

    def show
      authorize @account, :show?

      @account_moderation_note = current_account.account_moderation_notes.new(target_account: @account)
      @moderation_notes        = @account.targeted_moderation_notes.latest
      @warnings                = @account.targeted_account_warnings.latest.custom
    end

    def subscribe
      authorize @account, :subscribe?
      Pubsubhubbub::SubscribeWorker.perform_async(@account.id)
      redirect_to admin_account_path(@account.id)
    end

    def unsubscribe
      authorize @account, :unsubscribe?
      Pubsubhubbub::UnsubscribeWorker.perform_async(@account.id)
      redirect_to admin_account_path(@account.id)
    end

    def memorialize
      authorize @account, :memorialize?
      @account.memorialize!
      log_action :memorialize, @account
      redirect_to admin_account_path(@account.id)
    end

    def enable
      authorize @account.user, :enable?
      @account.user.enable!
      log_action :enable, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def approve
      authorize @account.user, :approve?
      @account.user.approve!
      redirect_to admin_accounts_path(pending: '1')
    end

    def reject
      authorize @account.user, :reject?
      SuspendAccountService.new.call(@account, including_user: true, destroy: true, skip_distribution: true)
      redirect_to admin_accounts_path(pending: '1')
    end

    def unsilence
      authorize @account, :unsilence?
      @account.unsilence!
      log_action :unsilence, @account
      redirect_to admin_account_path(@account.id)
    end

    def unsuspend
      authorize @account, :unsuspend?
      @account.unsuspend!
      log_action :unsuspend, @account
      redirect_to admin_account_path(@account.id)
    end

    def verify
      authorize @account, :verify?

      @account.is_verified = true
      @account.save!

      log_action :verify_account, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def unverify
      authorize @account, :verify?

      @account.is_verified = false
      @account.save!

      log_action :unverify_account, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def add_donor_badge
      authorize @account, :update_badges?

      @account.is_donor = true
      @account.save!

      log_action :add_donor_badge, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def remove_donor_badge
      authorize @account, :update_badges?

      @account.is_donor = false
      @account.save!

      log_action :remove_donor_badge, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def add_investor_badge
      authorize @account, :update_badges?

      @account.is_investor = true
      @account.save!

      log_action :add_investor_badge, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def remove_investor_badge
      authorize @account, :update_badges?

      @account.is_investor = false
      @account.save!

      log_action :remove_investor_badge, @account.user
      redirect_to admin_account_path(@account.id)
    end

    def redownload
      authorize @account, :redownload?

      @account.update!(last_webfingered_at: nil)
      ResolveAccountService.new.call(@account)

      redirect_to admin_account_path(@account.id)
    end

    def remove_avatar
      authorize @account, :remove_avatar?

      @account.avatar = nil
      @account.save!

      log_action :remove_avatar, @account.user

      redirect_to admin_account_path(@account.id)
    end

    def remove_header
      authorize @account, :remove_header?

      @account.header = nil
      @account.save!

      log_action :remove_header, @account.user

      redirect_to admin_account_path(@account.id)
    end

    def edit_pro
      authorize @account, :edit_pro?
    end

    def save_pro
      authorize @account, :edit_pro?
      
      @account.update!(pro_params)
      redirect_to edit_pro_admin_account_path(@account.id)
    end

    def edit
      redirect_to admin_account_path(@account.id) unless @account.local?
      @user = @account.user
    end

    def update
      redirect_to admin_account_path(@account.id) unless @account.local?
      @user = @account.user
      if @user.update(credentials_params)
        redirect_to admin_account_path(@account.id), notice: I18n.t('generic.changes_saved_msg')
      else
        render action: :edit
      end
    end


    private

    def set_account
      @account = Account.find(params[:id])
    end

    def require_remote_account!
      redirect_to admin_account_path(@account.id) if @account.local?
    end

    def require_local_account!
      redirect_to admin_account_path(@account.id) unless @account.local? && @account.user.present?
    end

    def filtered_accounts
      AccountFilter.new(filter_params).results
    end

    def filter_params
      params.permit(
        :local,
        :remote,
        :by_domain,
        :active,
        :pending,
        :silenced,
        :suspended,
        :username,
        :display_name,
        :email,
        :ip,
        :staff
      )
    end

    def pro_params
      params.require(:account).permit(:is_pro, :pro_expires_at)
    end

    def credentials_params
      new_params = params.require(:user).permit(:email, :password, :password_confirmation)
      if new_params[:password].blank? && new_params[:password_confirmation].blank?
        new_params.delete(:password)
        new_params.delete(:password_confirmation)
      end
      new_params
    end
  end
end
