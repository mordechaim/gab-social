# frozen_string_literal: true

class EditStatusService < BaseService
  include Redisable

  # Post a text status update, fetch and notify remote users mentioned
  # @param [Status] status Status being edited
  # @param [Hash] options
  # @option [String] :text Message
  # @option [Boolean] :sensitive
  # @option [String] :visibility
  # @option [String] :spoiler_text
  # @option [String] :language
  # @option [Enumerable] :media_ids Optional array of media IDs to attach
  # @option [Doorkeeper::Application] :application
  # @option [String] :idempotency Optional idempotency key
  # @return [Status]
  def call(status, options = {})
    @status      = status
    @account     = status.account
    @options     = options
    @text        = @options[:text] || ''

    return idempotency_duplicate if idempotency_given? && idempotency_duplicate?

    validate_media!
    preprocess_attributes!
    revision_text = prepare_revision_text

    process_status!
    postprocess_status!
    create_revision! revision_text

    redis.setex(idempotency_key, 3_600, @status.id) if idempotency_given?

    @status
  end

  private

  def preprocess_attributes!
    @text         = @options.delete(:spoiler_text) if @text.blank? && @options[:spoiler_text].present?
    @visibility   = @options[:visibility] || @account.user&.setting_default_privacy
    @visibility   = :unlisted if @visibility == :public && @account.silenced?
  rescue ArgumentError
    raise ActiveRecord::RecordInvalid
  end

  def process_status!
    @status.update!(status_attributes)

    process_hashtags_service.call(@status)
    process_mentions_service.call(@status)
  end

  def postprocess_status!
    LinkCrawlWorker.perform_async(@status.id) unless @status.spoiler_text?
  end

  def prepare_revision_text
    text              = @status.text
    current_media_ids = @status.media_attachments.pluck(:id)
    new_media_ids     = @options[:media_ids].take(4).map(&:to_i)

    if current_media_ids.sort != new_media_ids.sort
      text = "" if text == @options[:text]
      text += " [Media attachments changed]"
    end

    text.strip()
  end

  def create_revision!(text)
    @status.revisions.create!({
      text: text
    })
  end

  def validate_media!
    return if @options[:media_ids].blank? || !@options[:media_ids].is_a?(Enumerable)

    raise GabSocial::ValidationError, I18n.t('media_attachments.validations.too_many') if @options[:media_ids].size > 4

    @media = @account.media_attachments.where(id: @options[:media_ids].take(4).map(&:to_i))

    raise GabSocial::ValidationError, I18n.t('media_attachments.validations.images_and_video') if @media.size > 1 && @media.find(&:video?)
  end

  def language_from_option(str)
    ISO_639.find(str)&.alpha2
  end

  def process_mentions_service
    ProcessMentionsService.new
  end

  def process_hashtags_service
    ProcessHashtagsService.new
  end

  def idempotency_key
    "idempotency:status:#{@account.id}:#{@options[:idempotency]}"
  end

  def idempotency_given?
    @options[:idempotency].present?
  end

  def idempotency_duplicate
    @account.statuses.find(@idempotency_duplicate)
  end

  def idempotency_duplicate?
    @idempotency_duplicate = redis.get(idempotency_key)
  end

  def status_attributes
    {
      revised_at: Time.now,
      text: @text,
      media_attachments: @media || [],
      sensitive: (@options[:sensitive].nil? ? @account.user&.setting_default_sensitive : @options[:sensitive]) || @options[:spoiler_text].present?,
      spoiler_text: @options[:spoiler_text] || '',
      visibility: @visibility,
      language: language_from_option(@options[:language]) || @account.user&.setting_default_language&.presence || LanguageDetector.instance.detect(@text, @account),
      application: @options[:application],
    }.compact
  end
end
