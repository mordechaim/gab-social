# frozen_string_literal: true

class REST::PromotionSerializer < ActiveModel::Serializer
  attributes :status_id, :timeline_id, :position

  def status_id
    object.status_id.to_s
  end
end
