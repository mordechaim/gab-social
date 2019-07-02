# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :authenticate_user!
  before_action :set_referrer_policy_header
  before_action :set_initial_state_json

  def index
    @body_classes = 'app-body'
  end

  private

  def authenticate_user!
    return if user_signed_in?

    # if no current user, dont allow to navigate to these paths
    matches = request.path.match(/\A\/(home|groups|tags|lists|notifications|explore|follow_requests|blocks|domain_blocks|mutes)/)

    if matches
      redirect_to(homepage_path)
    end
  end

  def set_initial_state_json
    serializable_resource = ActiveModelSerializers::SerializableResource.new(InitialStatePresenter.new(initial_state_params), serializer: InitialStateSerializer)
    @initial_state_json   = serializable_resource.to_json
  end

  def initial_state_params
    if !current_user.nil?
      {
        settings: Web::Setting.find_by(user: current_user)&.data || {},
        push_subscription: current_account.user.web_push_subscription(current_session),
        current_account: current_account,
        token: current_session.token,
        admin: Account.find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')),
      }
    else
      {
        admin: Account.find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')),
      }
    end
  end

  def set_referrer_policy_header
    response.headers['Referrer-Policy'] = 'origin'
  end
end
