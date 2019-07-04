# frozen_string_literal: true

task fix_key_pairs: 'gabsocial:fix_key_pairs'

namespace :gabsocial do
  desc 'Generates key pairs for migrated accounts'
  task :fix_key_pairs => :environment do
    Account.select(:id, :username, :private_key, :public_key).all.each do |a|
        if a.public_key == "tobefilled"
            keypair = OpenSSL::PKey::RSA.new(2048)
            private_key = keypair.to_pem
            public_key  = keypair.public_key.to_pem
            a.update_columns private_key: private_key, public_key: public_key
        end
    end
  end
end
