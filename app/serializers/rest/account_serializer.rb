# frozen_string_literal: true

class REST::AccountSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :id, :username, :acct, :display_name, :locked, :bot, :created_at,
             :note, :url, :avatar, :avatar_static, :header, :header_static,
             :followers_count, :following_count, :statuses_count, :is_pro, :is_verified, :is_donor, :is_investor

  has_one :moved_to_account, key: :moved, serializer: REST::AccountSerializer, if: :moved_and_not_nested?
  has_many :emojis, serializer: REST::CustomEmojiSerializer

  class FieldSerializer < ActiveModel::Serializer
    attributes :name, :value, :verified_at

    def value
      Formatter.instance.format_field(object.account, object.value)
    end
  end

  has_many :fields

  def id
    object.id.to_s
  end

  def note
    Formatter.instance.simplified_format(object)
  end

  def url
    TagManager.instance.url_for(object)
  end

  def avatar
    if object.avatar_file_name.nil? and object.avatar_remote_url and object.avatar_remote_url.start_with? "gab://avatar/"
      return object.avatar_remote_url.sub("gab://avatar/", "https://gab.com/media/user/") 
    end

    full_asset_url(object.avatar_original_url)
  end

  def avatar_static
    if object.avatar_file_name.nil? and object.avatar_remote_url and object.avatar_remote_url.start_with? "gab://avatar/"
      return object.avatar_remote_url.sub("gab://avatar/", "https://gab.com/media/user/") 
    end

    full_asset_url(object.avatar_static_url)
  end

  def header
    if object.header_file_name.nil? and object.header_remote_url and object.header_remote_url.start_with? "gab://header/"
      return object.header_remote_url.sub("gab://header/", "https://gab.com/media/user/") 
    end

    full_asset_url(object.header_original_url)
  end

  def header_static
    if object.header_file_name.nil? and object.header_remote_url and object.header_remote_url.start_with? "gab://header/"
      return object.header_remote_url.sub("gab://header/", "https://gab.com/media/user/") 
    end

    full_asset_url(object.header_static_url)
  end

  def moved_and_not_nested?
    object.moved? && object.moved_to_account.moved_to_account_id.nil?
  end
end
