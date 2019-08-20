# frozen_string_literal: true

class Api::V1::Groups::AccountsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:show]

  before_action :require_user!
  before_action :set_group

  after_action :insert_pagination_headers, only: :show

  def show
    @accounts = load_accounts
    render json: @accounts, each_serializer: REST::AccountSerializer
  end

  def create
    authorize @group, :join?

    @group.accounts << current_account

    if current_user.allows_group_in_home_feed?
      current_user.force_regeneration!
    end

    render json: @group, serializer: REST::GroupRelationshipSerializer, relationships: relationships
  end

  def update
    authorize @group, :update_account?

    @account = @group.accounts.find(params[:account_id])
    GroupAccount.where(group: @group, account: @account).update(group_account_params)
    render_empty
  end

  def destroy
    authorize @group, :leave?

    GroupAccount.where(group: @group, account_id: current_account.id).destroy_all

    if current_user.allows_group_in_home_feed?
      current_user.force_regeneration!
    end

    render json: @group, serializer: REST::GroupRelationshipSerializer, relationships: relationships
  end

  private

  def relationships
    GroupRelationshipsPresenter.new([@group.id], current_user.account_id)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

  def load_accounts
    if unlimited?
      @group.accounts.includes(:account_stat).all
    else
      @group.accounts.includes(:account_stat).paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT), params[:max_id], params[:since_id])
    end
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    return if unlimited?

    if records_continue?
      api_v1_group_accounts_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    return if unlimited?

    unless @accounts.empty?
      api_v1_group_accounts_url pagination_params(since_id: pagination_since_id)
    end
  end

  def pagination_max_id
    @accounts.last.id
  end

  def pagination_since_id
    @accounts.first.id
  end

  def records_continue?
    @accounts.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def unlimited?
    params[:limit] == '0'
  end

  def group_account_params
    params.permit(:role, :write_permissions)
  end
end
