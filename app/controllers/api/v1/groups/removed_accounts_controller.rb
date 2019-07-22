# frozen_string_literal: true

class Api::V1::Groups::RemovedAccountsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :write, :'write:groups' }

  before_action :require_user!
  before_action :set_group

  after_action :insert_pagination_headers, only: :show

  def show
    authorize @group, :show_removed_accounts?

    @accounts = load_accounts
    render json: @accounts, each_serializer: REST::AccountSerializer
  end

  def create
    authorize @group, :create_removed_account?

    @account = @group.accounts.find(params[:account_id])
    @group.removed_accounts << @account
    GroupAccount.where(group: @group, account: @account).destroy_all
    render_empty
  end

  def destroy
    authorize @group, :destroy_removed_account?

    @account = @group.removed_accounts.find(params[:account_id])
    GroupRemovedAccount.where(group: @group, account: @account).destroy_all
    render_empty
  end

  private

  def set_group
    @group = Group.find(params[:group_id])
  end

  def load_accounts
    if unlimited?
      @group.removed_accounts.includes(:account_stat).all
    else
      @group.removed_accounts.includes(:account_stat).paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT), params[:max_id], params[:since_id])
    end
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    return if unlimited?

    if records_continue?
      api_v1_group_removed_accounts_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    return if unlimited?

    unless @accounts.empty?
      api_v1_group_removed_accounts_url pagination_params(since_id: pagination_since_id)
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
end
