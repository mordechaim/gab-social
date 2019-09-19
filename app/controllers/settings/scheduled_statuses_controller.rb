# frozen_string_literal: true

class Settings::ScheduledStatusesController < Settings::BaseController
  layout 'admin'

  before_action :authenticate_user!
  before_action :set_account
  before_action :set_scheduled_statuses, only: :index
  before_action :set_scheduled_status, only: :destroy

  def index
    @scheduled_statuses
  end

  def destroy
    @scheduled_status.destroy!
    redirect_to settings_scheduled_statuses_path
  end

  private

  def set_account
    @account = current_user.account
  end

  def set_scheduled_statuses
    @scheduled_statuses = @account.scheduled_statuses
  end

  def set_scheduled_status
    @scheduled_status = @account.scheduled_statuses.find(params[:id])
  end
end