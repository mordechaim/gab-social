# frozen_string_literal: true

class GroupUnlinkStatusService < BaseService
  def call(account, group, status)
    @account = account
    @group = group
    @status = status

    raise GabSocial::Error, "Record not found." if @group.id != @status.group_id

    # Update status
    @status.group_id = nil
    @status.thread = nil
    @status.save!(validate: false)
  end
end
