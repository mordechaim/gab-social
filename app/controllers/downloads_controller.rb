# frozen_string_literal: true

class DownloadsController < ApplicationController
  layout 'public'

  before_action :check_enabled

  def source
    send_file Rails.root.join('public', 'src', 'gab-social.zip')
  end

end