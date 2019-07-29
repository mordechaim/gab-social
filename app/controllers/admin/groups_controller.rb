# frozen_string_literal: true

module Admin
    class GroupsController < BaseController
        before_action :set_group, except: [:index]
        before_action :set_filter_params

        def index
            authorize :group, :index?
            @groups = filtered_groups.page(params[:page])
        end

        def destroy
            authorize @group, :destroy?
            @group.destroy!
            log_action :destroy, @group
            flash[:notice] = I18n.t('admin.groups.destroyed_msg')
            redirect_to admin_groups_path(page: params[:page], **@filter_params)
        end

        def enable_featured
            authorize @group, :update?
            @group.is_featured = true
            @group.save!
            log_action :update, @group
            flash[:notice] = I18n.t('admin.groups.updated_msg')
            redirect_to admin_groups_path(page: params[:page], **@filter_params)
        end

        def disable_featured
            authorize @group, :update?
            @group.is_featured = false
            @group.save!
            log_action :update, @group
            flash[:notice] = I18n.t('admin.groups.updated_msg')
            redirect_to admin_groups_path(page: params[:page], **@filter_params)
        end

        private

        def set_group
            @group = Group.find(params[:id])
        end

        def set_filter_params
            @filter_params = filter_params.to_hash.symbolize_keys
        end

        def resource_params
            params.require(:group).permit(:is_featured, :is_nsfw)
        end

        def filtered_groups
            query = Group.order('is_featured DESC, member_count DESC')
            
            if params[:title]
                query = query.where("LOWER(title) LIKE LOWER(?)", "%#{params[:title]}%")
            end

            return query
        end

        def filter_params
            params.permit(:sort,)
        end
    end
end
