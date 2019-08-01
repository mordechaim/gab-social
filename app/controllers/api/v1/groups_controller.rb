# frozen_string_literal: true

class Api::V1::GroupsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:index, :show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:index, :show]

  before_action :require_user!
  before_action :set_group, except: [:index, :create]

  def index
    case current_tab
      when 'featured'
        @groups = Group.where(is_featured: true).limit(50).all
      when 'member'
        @groups = Group.joins(:group_accounts).where(is_archived: false, group_accounts: { account: current_account }).order('group_accounts.unread_count DESC, group_accounts.id DESC').all
      when 'admin'
        @groups = Group.joins(:group_accounts).where(is_archived: false, group_accounts: { account: current_account, role: :admin }).all
    end

    render json: @groups, each_serializer: REST::GroupSerializer
  end

  def current_tab 
    tab = 'featured'
    tab = params[:tab] if ['featured', 'member', 'admin'].include? params[:tab]
    return tab
  end

  def show
    render json: @group, serializer: REST::GroupSerializer
  end

  def create
    authorize :group, :create?
    
    @group = Group.create!(group_params.merge(account: current_account))
    render json: @group, serializer: REST::GroupSerializer
  end

  def update
    authorize @group, :update?

    @group.update!(group_params)
    render json: @group, serializer: REST::GroupSerializer
  end

  def destroy
    authorize @group, :destroy?

    @group.is_archived = true
    @group.save!
    render_empty
  end

  def destroy_status
    authorize @group, :destroy_status?

    status = Status.find(params[:status_id])
    GroupUnlinkStatusService.new.call(current_account, @group, status)
    render_empty
  end

  def approve_status
    authorize @group, :approve_status?

    status = Status.find(params[:status_id])
    GroupApproveStatusService.new.call(current_account, @group, status)
    render_empty
  end

  private

  def set_group
    @group = Group.find(params[:id])
  end

  def group_params
    params.permit(:title, :cover_image, :description)
  end
end
