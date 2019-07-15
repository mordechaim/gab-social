# frozen_string_literal: true

class GroupQueryService < BaseService
  def call(group)
    Status.as_group_timeline(group)
  end
end
