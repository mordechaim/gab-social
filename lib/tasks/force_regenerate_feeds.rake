# frozen_string_literal: true

task force_regenerate_feeds: 'gabsocial:force-regenerate-feeds'

namespace :gabsocial do
  desc 'Re-generate home feeds for all users (run after any migrations)'
  task :force_regenerate_feeds => :environment do
    Account.select(:id, :username).all.each do |a|
        Redis.current.set("account:#{a.id}:regeneration", true)
        puts(a.username)
    end
  end
end
