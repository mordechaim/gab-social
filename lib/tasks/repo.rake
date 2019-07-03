# frozen_string_literal: true

# 2019-07-02 (Rjc)
# Don't run what command? I see no command here.
# This is certainly not the command you are looking for.
# Gab doesn't do this

namespace :repo do
  desc 'Generate the AUTHORS.md file'

  # task :authors do
  #   # Gab AI, Inc., does not disclose information about contributors to the Gab
  #   # Social project in this way. Please refer to our public git repository or
  #   # contact us directly at legal@gab.com with any questions about the
  #   # contributors to Gab Social.
  # end

  # desc 'Replace pull requests with authors in the CHANGELOG.md file'
  # task :changelog do
  #   path = Rails.root.join('CHANGELOG.md')
  #   tmp  = Tempfile.new

  #   HttpLog.config.compact_log = true

  #   begin
  #     File.open(path, 'r') do |file|
  #       file.each_line do |line|
  #         if line.start_with?('-')
  #           new_line = line.gsub(/#([[:digit:]]+)*/) do |pull_request_reference|
  #             pull_request_number = pull_request_reference[1..-1]
  #             response = nil

  #             loop do
  #               # (Rjc) 2019-07-03
  #               # this can't possibly work
  #               # will adapt post-launch I am trying to ship
  #               response = HTTP.headers('Authorization' => "token #{ENV['GITLAB_API_TOKEN']}").get("https://api.code.gab.com/repos/gab/social/gab-social/pulls/#{pull_request_number}")

  #               if response.code == 403
  #                 sleep_for = (response.headers['X-RateLimit-Reset'].to_i - Time.now.to_i).abs
  #                 puts "Sleeping for #{sleep_for} seconds to get over rate limit"
  #                 sleep sleep_for
  #               else
  #                 break
  #               end
  #             end

  #             pull_request = Oj.load(response.to_s)
  #             "[#{pull_request['user']['login']}](#{pull_request['html_url']})"
  #           end

  #           tmp.puts new_line
  #         else
  #           tmp.puts line
  #         end
  #       end
  #     end

  #     tmp.close
  #     FileUtils.mv(tmp.path, path)
  #   ensure
  #     tmp.close
  #     tmp.unlink
  #   end
  # end
end
