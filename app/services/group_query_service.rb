# frozen_string_literal: true

class GroupQueryService < BaseService
  def call(group)
    Status.distinct
          .as_group_timeline(group)
  end
end
