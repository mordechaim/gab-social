# frozen_string_literal: true

class Api::V1::TrendsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read }
  before_action :require_user!
  before_action :set_tags

  respond_to :json

  def index
    render json: @tags, each_serializer: REST::TagSerializer
  end

  private

  def set_tags
    @tags = TrendingTags.get(7)
  end
end
