# frozen_string_literal: true

class Api::V1::AccountByUsernameController < Api::BaseController
  before_action :set_account
  before_action :check_account_suspension

  respond_to :json

  def show
    render json: @account, serializer: REST::AccountSerializer
  end

  def set_account
    user = "#{params[:username]}.#{params[:format]}".split("@")
    if user[1]
      @account = Account.find_remote!(user[0], user[1])
    else
      @account = Account.find_local!(user[0])
    end
  end

  def check_account_suspension
    gone if @account.suspended?
  end
end
