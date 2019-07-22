# frozen_string_literal: true

task fix_group_member_counts: 'gabsocial:fix-group-member-counts'

namespace :gabsocial do
  desc 'Re-compute group member counts'
  task :fix_group_member_counts => :environment do
    Group.select(:id).all.each do |group|
      group.update_column(:member_count, group.accounts.count)
    end
  end
end
