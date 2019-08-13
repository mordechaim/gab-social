# frozen_string_literal: true

class ProcessQuoteService < BaseService
    include StreamEntryRenderer
  
    # Create notification for a quote
    # @param [Status] status Quoting status
    # @return [Status]
    def call(status)
      create_notification(status)
      bump_potential_friendship(status)
    end
  
    private
  
    def create_notification(status)
      quoted_status = status.quote

      if quoted_status.account.local?
        LocalNotificationWorker.perform_async(quoted_status.account_id, status.id, status.class.name)
      elsif quoted_status.account.ostatus?
        NotificationWorker.perform_async(stream_entry_to_xml(status.stream_entry), status.account_id, quoted_status.account_id)
      elsif quoted_status.account.activitypub? && !quoted_status.account.following?(status.account)
        ActivityPub::DeliveryWorker.perform_async(build_json(status), status.account_id, quoted_status.account.inbox_url)
      end
    end
  
    def bump_potential_friendship(status)
      ActivityTracker.increment('activity:interactions')
      return if status.account.following?(status.quote.account_id)
      PotentialFriendshipTracker.record(status.account_id, status.quote.account_id, :reblog)
    end
  
    def build_json(status)
      Oj.dump(ActivityPub::LinkedDataSignature.new(ActiveModelSerializers::SerializableResource.new(
        status,
        serializer: ActivityPub::ActivitySerializer,
        adapter: ActivityPub::Adapter
      ).as_json).sign!(status.account))
    end
  end
  