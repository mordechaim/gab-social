# frozen_string_literal: true

class REST::StatusRevisionSerializer < ActiveModel::Serializer
  attributes :created_at, :text
end
