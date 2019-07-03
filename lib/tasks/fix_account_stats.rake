# frozen_string_literal: true

task fix_account_stats: 'gabsocial:fix-account-stats'

namespace :gabsocial do
  desc 'Re-compute user statistics (following cnt, followers cnt, etc.)'
  task :fix_account_stats => :environment do
    Account.select(:id, :username).all.each do |a|
      a.account_stat.following_count = Follow.where(account_id: a.id).count
      a.account_stat.followers_count = Follow.where(target_account_id: a.id).count
      a.account_stat.statuses_count = Status.where(account_id: a.id).count
      a.account_stat.save!
      # puts(a.username)
    end
  end
end
