require_relative '../../lib/gabsocial/premailer_webpack_strategy'

Premailer::Rails.config.merge!(remove_ids: true,
                               adapter: :nokogiri,
                               generate_text_part: false,
                               strategies: [PremailerWebpackStrategy])
