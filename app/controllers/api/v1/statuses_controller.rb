# frozen_string_literal: true

class Api::V1::StatusesController < Api::BaseController
  include Authorization

  before_action -> { authorize_if_got_token! :read, :'read:statuses' }, except: [:create, :update, :destroy]
  before_action -> { doorkeeper_authorize! :write, :'write:statuses' }, only:   [:create, :update, :destroy]
  before_action :require_user!, except:  [:show, :context, :card]
  before_action :set_status, only:       [:show, :context, :card, :update, :revisions]

  respond_to :json

  # This API was originally unlimited, pagination cannot be introduced without
  # breaking backwards-compatibility. Arbitrarily high number to cover most
  # conversations as quasi-unlimited, it would be too much work to render more
  # than this anyway
  CONTEXT_LIMIT = 4_096

  def show
    @status = cache_collection([@status], Status).first
    render json: @status, serializer: REST::StatusSerializer
  end

  def context
    ancestors_results   = @status.in_reply_to_id.nil? ? [] : @status.ancestors(CONTEXT_LIMIT, current_account)
    descendants_results = @status.descendants(CONTEXT_LIMIT, current_account)
    loaded_ancestors    = cache_collection(ancestors_results, Status)
    loaded_descendants  = cache_collection(descendants_results, Status)

    @context = Context.new(ancestors: loaded_ancestors, descendants: loaded_descendants)
    statuses = [@status] + @context.ancestors + @context.descendants

    render json: @context, serializer: REST::ContextSerializer, relationships: StatusRelationshipsPresenter.new(statuses, current_user&.account_id)
  end

  def revisions
    @revisions = @status.revisions

    render json: @revisions, each_serializer: REST::StatusRevisionSerializer
  end

  def create
    @status = PostStatusService.new.call(current_user.account,
                                         text: status_params[:status],
                                         thread: status_params[:in_reply_to_id].blank? ? nil : Status.find(status_params[:in_reply_to_id]),
                                         media_ids: status_params[:media_ids],
                                         sensitive: status_params[:sensitive],
                                         spoiler_text: status_params[:spoiler_text],
                                         visibility: status_params[:visibility],
                                         scheduled_at: status_params[:scheduled_at],
                                         application: doorkeeper_token.application,
                                         poll: status_params[:poll],
                                         idempotency: request.headers['Idempotency-Key'],
                                         group_id: status_params[:group_id],
                                         quote_of_id: status_params[:quote_of_id])

    render json: @status, serializer: @status.is_a?(ScheduledStatus) ? REST::ScheduledStatusSerializer : REST::StatusSerializer
  end

  def update
    authorize @status, :update?
    
    @status = EditStatusService.new.call(@status,
                                         text: status_params[:status],
                                         media_ids: status_params[:media_ids],
                                         sensitive: status_params[:sensitive],
                                         spoiler_text: status_params[:spoiler_text],
                                         visibility: status_params[:visibility],
                                         application: doorkeeper_token.application,
                                         idempotency: request.headers['Idempotency-Key'])

    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    @status = Status.where(account_id: current_user.account).find(params[:id])
    authorize @status, :destroy?

    RemovalWorker.perform_async(@status.id)

    render json: @status, serializer: REST::StatusSerializer, source_requested: true
  end

  private

  def set_status
    @status = Status.find(params[:id])
    authorize @status, :show?
  rescue GabSocial::NotPermittedError
    raise ActiveRecord::RecordNotFound
  end

  def status_params
    params.permit(
      :status,
      :in_reply_to_id,
      :quote_of_id,
      :sensitive,
      :spoiler_text,
      :visibility,
      :scheduled_at,
      :group_id,
      media_ids: [],
      poll: [
        :multiple,
        :hide_totals,
        :expires_in,
        options: [],
      ],
    )
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end
end
