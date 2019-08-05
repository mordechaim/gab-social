# frozen_string_literal: true

class Api::V1::AccountByUsernameController < Api::BaseController
  before_action :set_account
  before_action :check_account_suspension

  respond_to :json

  def show
    render json: @account, serializer: REST::AccountSerializer
  end

  def set_account
    username, domain = params[:username].split("@")
    if domain
      @account = Account.find_remote!(username, domain)
    else
      @account = Account.find_local!(username)
    end
  end

  def check_account_suspension
    gone if @account.suspended?
  end
end
