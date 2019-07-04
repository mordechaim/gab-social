# frozen_string_literal: true

class Api::V1::Statuses::FavouritedByAccountsController < Api::BaseController
  include Authorization

  before_action -> { authorize_if_got_token! :read, :'read:accounts' }

  respond_to :json

  def index
    render json: {}, status: :ok
  end

  private

  def load_accounts
    #
  end

  def default_accounts
    #
  end

  def paginated_favourites
    #
  end

  def next_path
    #
  end

  def prev_path
    #
  end

  def pagination_max_id
    #
  end

  def pagination_since_id
    #
  end

  def records_continue?
    #
  end

  def set_status
    #
  end

  def pagination_params(core_params)
    #
  end
end
