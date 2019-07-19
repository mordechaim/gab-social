# frozen_string_literal: true

class GroupRelationshipsPresenter
    attr_reader :member, :admin, :unread_count
  
    def initialize(group_ids, current_account_id, **options)
      @group_ids          = group_ids.map { |a| a.is_a?(Group) ? a.id : a }
      @current_account_id = current_account_id
  
      @member       = cached[:member].merge(Group.member_map(@uncached_group_ids, @current_account_id))
      @admin        = cached[:admin].merge(Group.admin_map(@uncached_group_ids, @current_account_id))
      @unread_count = cached[:unread_count].merge(Group.unread_count_map(@uncached_group_ids, @current_account_id))
  
      cache_uncached!
  
      @member.merge!(options[:member_map] || {})
      @admin.merge!(options[:admin_map] || {})
      @unread_count.merge!(options[:unread_count_map] || {})
    end
  
    private
  
    def cached
      return @cached if defined?(@cached)
  
      @cached = {
        member: {},
        admin: {},
        unread_count: {},
      }
  
      @uncached_group_ids = []
      
      @group_ids.each do |group_id|
        maps_for_group = Rails.cache.read("relationship:#{@current_account_id}:group#{group_id}")
  
        if maps_for_group.is_a?(Hash)
          @cached.deep_merge!(maps_for_group)
        else
          @uncached_group_ids << group_id
        end
      end
  
      @cached
    end
  
    def cache_uncached!
      @uncached_group_ids.each do |group_id|
        maps_for_account = {
          member:       { group_id => member[group_id] },
          admin:        { group_id => admin[group_id] },
          unread_count: { group_id => unread_count[group_id] },
        }
  
        Rails.cache.write("relationship:#{@current_account_id}:group#{group_id}", maps_for_account, expires_in: 1.day)
      end
    end
  end
  