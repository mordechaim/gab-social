# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :authenticate_user!
  before_action :set_referrer_policy_header
  before_action :set_initial_state_json
  before_action :set_data_for_meta

  def index
    @body_classes = 'app-body'
  end

  private

  def set_data_for_meta
    return if find_route_matches

    if params[:username].present?
      @account = Account.find_local(params[:username])
    elsif params[:account_username].present?
      @account = Account.find_local(params[:account_username])

      if params[:id].present? && !@account.nil?
        @status = @account.statuses.find(params[:id])
        @stream_entry = @status.stream_entry
        @type = @stream_entry.activity_type.downcase
      end
    end

    if request.path.starts_with?('/tags') && params[:tag].present?
      @tag = Tag.find_normalized(params[:tag])
    end

  end

  def authenticate_user!
    return if user_signed_in?

    # if no current user, dont allow to navigate to these paths
    if find_route_matches
      redirect_to(homepage_path)
    end
  end

  def find_route_matches
    request.path.match(/\A\/(home|groups|lists|notifications|explore|follow_requests|blocks|domain_blocks|mutes)/)
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
