class Settings::PromotionsController < Admin::BaseController
	before_action :set_promotion, except: [:index, :new, :create]
	
	def index
		@promotions = Promotion.all
	end

	def new
		@promotion = Promotion.new
	end

	def create
		@promotion = Promotion.new(resource_params)
		
		if @promotion.save
			log_action :create, @promotion
			redirect_to settings_promotions_path, notice: I18n.t('promotions.created_msg')
		else
			render :new
		end
	  end

	def edit
	end

	def update
		if @promotion.update(resource_params)
			log_action :update, @promotion
			flash[:notice] = I18n.t('promotions.updated_msg')
		else
			flash[:alert] =  I18n.t('promotions.update_failed_msg')
		end
		redirect_to settings_promotions_path
	end

	def destroy
		@promotion.destroy!
		log_action :destroy, @promotion
		flash[:notice] = I18n.t('promotions.destroyed_msg')
		redirect_to settings_promotions_path
	end

	private

	def set_promotion
		@promotion = Promotion.find(params[:id])
	end

    def set_filter_params
      @filter_params = filter_params.to_hash.symbolize_keys
    end

    def resource_params
      params.require(:promotion).permit(:expires_at, :status_id, :timeline_id, :position)
    end
end
