# frozen_string_literal: true

class SidekiqErrorHandler
  def call(*)
    yield
  rescue GabSocial::HostValidationError => e
    Rails.logger.error "#{e.class}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    # Do not retry
  end
end
