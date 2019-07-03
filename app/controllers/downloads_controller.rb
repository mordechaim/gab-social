# frozen_string_literal: true

class DownloadsController < ApplicationController
  layout 'public'

  before_action :check_enabled

end