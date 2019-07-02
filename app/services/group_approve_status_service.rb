# frozen_string_literal: true

class GroupApproveStatusService < BaseService
  def call(account, group, status)
    @account = account
    @group = group
    @status = status

    raise GabSocial::Error, "Record not found." if @group.id != @status.group_id

    # Update status
    # @status.awaiting_moderation = false
    # @status.save!

    # Grant write permissions
    GroupAccount.where(group: @group, account_id: @status.account_id).update write_permissions: true
  end
end
