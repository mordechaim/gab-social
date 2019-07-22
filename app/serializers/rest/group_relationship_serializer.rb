# frozen_string_literal: true

class REST::GroupRelationshipSerializer < ActiveModel::Serializer
  attributes :id, :member, :admin, :unread_count

  def id
    object.id.to_s
  end

  def member
    instance_options[:relationships].member[object.id] ? true : false
  end

  def admin
    instance_options[:relationships].admin[object.id] ? true : false
  end

  def unread_count
    instance_options[:relationships].unread_count[object.id] || 0
  end
end
