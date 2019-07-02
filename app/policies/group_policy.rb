# frozen_string_literal: true

class GroupPolicy < ApplicationPolicy
  def update?
    check_archive!
    is_group_admin?
  end

  def destroy?
    check_archive!
    is_group_admin?
  end

  def approve_status?
    check_archive!
    is_group_admin?
  end

  def destroy_status?
    check_archive!
    is_group_admin?
  end

  def join?
    check_archive!
    raise GabSocial::ValidationError, "User is already a member of this group." if is_member?

    return true
  end

  def leave?
    check_archive!
    raise GabSocial::ValidationError, "Group member account not found." if not is_member?
    
    is_account_the_only_admin = (is_group_admin? and record.group_accounts.where(role: :admin).count == 1)
    raise GabSocial::ValidationError, "This is the last admin of this group." if is_account_the_only_admin

    return true
  end

  def update_account?
    is_group_admin?
  end

  private

  def is_member?
    record.group_accounts.where(account_id: current_account.id).exists?
  end

  def is_group_admin?
    record.group_accounts.where(account_id: current_account.id, role: :admin).exists?
  end

  def check_archive!
    raise GabSocial::ValidationError, "This group has been archived." if record.is_archived
  end
end
