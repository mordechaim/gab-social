# frozen_string_literal: true

class REST::GroupSerializer < ActiveModel::Serializer
  include RoutingHelper
  
  attributes :id, :title, :description, :cover_image_url, :is_archived

  def id
    object.id.to_s
  end

  def cover_image_url
    full_asset_url(object.cover_image.url)
  end
end
