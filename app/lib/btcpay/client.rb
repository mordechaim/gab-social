class Btcpay::Client
  # @return [Client]
  # @example
  #  # Create a client with a pem file created by the bitpay client:
  #  client = BitPay::SDK::Client.new
  def initialize(opts={})
    @auth_header        = "Basic " + opts[:legacy_token]
    @pub_key            = opts[:pub_key]
    @client_id          = opts[:client_id]
    @uri                = URI.parse opts[:api_uri] || API_URI
    @user_agent         = 'ruby-bitpay-sdk'
    @https              = Net::HTTP.new @uri.host, @uri.port
    @https.use_ssl      = true
    @https.open_timeout = 10
    @https.read_timeout = 10

    #@https.ca_file      = File.join File.dirname(__FILE__), 'cacert.pem'
    @tokens             = opts[:tokens] || {}

    # Option to disable certificate validation in extraordinary circumstance.  NOT recommended for production use
    @https.verify_mode = opts[:insecure] == true ? OpenSSL::SSL::VERIFY_NONE : OpenSSL::SSL::VERIFY_PEER
    
    # Option to enable http request debugging
    @https.set_debug_output($stdout) if opts[:debug] == true
  end

  ## Pair client with BitPay service
  # => Pass empty hash {} to retreive client-initiated pairing code
  # => Pass {pairingCode: 'WfD01d2'} to claim a server-initiated pairing code
  #
  def pair_client(params={})
    tokens = post(path: 'tokens', params: params)
    return tokens["data"]
  end

  ## Compatibility method for pos pairing
  #
  def pair_pos_client(claimCode)
    raise BitPay::ArgumentError, "pairing code is not legal" unless verify_claim_code(claimCode)
    pair_client({pairingCode: claimCode})
  end

  ## Create bitcoin invoice
  #
  #   Defaults to pos facade, also works with merchant facade
  # 
  def create_invoice(price:, currency:, facade: 'pos', params:{})
    raise BitPay::ArgumentError, "Illegal Argument: Price must be formatted as a float" unless 
      price.is_a?(Numeric) ||
      /^[[:digit:]]+(\.[[:digit:]]{2})?$/.match(price) ||
      currency == 'BTC' && /^[[:digit:]]+(\.[[:digit:]]{1,6})?$/.match(price)
    raise BitPay::ArgumentError, "Illegal Argument: Currency is invalid." unless /^[[:upper:]]{3}$/.match(currency)
    params.merge!({price: price, currency: currency})
    token = get_token(facade)
    invoice = post(path: "invoices", token: token, params: params)
    invoice["data"]
  end

  ## Gets the privileged merchant-version of the invoice		
  #   Requires merchant facade token		
  #		
  def get_invoice(id:)
    token = get_token('merchant')
    invoice = get(path: "invoices/#{id}", token: token)
    invoice["data"]
  end

  ## Gets the public version of the invoice
  #
  def get_public_invoice(id:)
    invoice = get(path: "invoices/#{id}", public: true)
    invoice["data"]
  end
  
  
  ## Refund paid BitPay invoice
  #
  #   If invoice["data"]["flags"]["refundable"] == true the a refund address was 
  #   provided with the payment and the refund_address parameter is an optional override
  #  
  #   Amount and Currency are required fields for fully paid invoices but optional
  #   for under or overpaid invoices which will otherwise be completely refunded
  #
  #   Requires merchant facade token
  #
  #  @example
  #    client.refund_invoice(id: 'JB49z2MsDH7FunczeyDS8j', params: {amount: 10, currency: 'USD', bitcoinAddress: '1Jtcygf8W3cEmtGgepggtjCxtmFFjrZwRV'})
  #
  def refund_invoice(id:, params:{})
    invoice = get_invoice(id: id)
    refund = post(path: "invoices/#{id}/refunds", token: invoice["token"], params: params)
    refund["data"]
  end
  
  ## Get All Refunds for Invoice
  #   Returns an array of all refund requests for a specific invoice, 
  # 
  #   Requires merchant facade token
  #
  #  @example:
  #    client.get_all_refunds_for_invoice(id: 'JB49z2MsDH7FunczeyDS8j')
  #
  def get_all_refunds_for_invoice(id:)
    urlpath = "invoices/#{id}/refunds"
    invoice = get_invoice(id: id)
    refunds = get(path: urlpath, token: invoice["token"])
    refunds["data"]
  end

  ## Get Refund
  #   Requires merchant facade token
  #
  #  @example:
  #    client.get_refund(id: 'JB49z2MsDH7FunczeyDS8j', request_id: '4evCrXq4EDXk4oqDXdWQhX')
  #
  def get_refund(invoice_id:, request_id:)
    urlpath = "invoices/#{invoice_id}/refunds/#{request_id}"
    invoice = get_invoice(id: invoice_id)
    refund = get(path: urlpath, token: invoice["token"])
    refund["data"]
  end
  
  ## Cancel Refund
  #   Requires merchant facade token
  #
  #  @example:
  #    client.cancel_refund(id: 'JB49z2MsDH7FunczeyDS8j', request_id: '4evCrXq4EDXk4oqDXdWQhX')
  #
  def cancel_refund(invoice_id:, request_id:)
    urlpath = "invoices/#{invoice_id}/refunds/#{request_id}"
    refund = get_refund(invoice_id: invoice_id, request_id: request_id)
    deletion = delete(path: urlpath, token: refund["token"])
    deletion["data"]
  end      

  ## Checks that the passed tokens are valid by
  #  comparing them to those that are authorized by the server
  #
  #  Uses local @tokens variable if no tokens are passed
  #  in order to validate the connector is properly paired
  #
  def verify_tokens(tokens: @tokens)
    server_tokens = refresh_tokens
    tokens.each{|key, value| return false if server_tokens[key] != value}
    return true
  end

  private

  def verify_claim_code(claim_code)
    regex = /^[[:alnum:]]{7}$/
      matches = regex.match(claim_code)
    !(matches.nil?)
  end

  def send_request(verb, path, facade: 'merchant', params: {}, token: nil)
    token ||= get_token(facade)
    case verb.upcase
    when "GET"
      return get(path: path, token: token)
    when "POST"
      return post(path: path, token: token, params: params)
    else
      raise(StandardError, "Invalid HTTP verb: #{verb.upcase}")
    end
  end

  def get(path:, token: nil, public: false)
    urlpath = '/' + path
    token_prefix = if urlpath.include? '?' then '&token=' else '?token=' end
    urlpath = urlpath + token_prefix + token if token
    request = Net::HTTP::Get.new urlpath
    unless public
      request['Authorization'] = @auth_header
      request['X-Identity'] = @pub_key
    end
    process_request(request)
  end

  def post(path:, token: nil, params:)
    urlpath = '/' + path
    request = Net::HTTP::Post.new urlpath
    params[:token] = token if token 
    params[:guid]  = SecureRandom.uuid
    params[:id] = @client_id
    request.body = params.to_json
    if token
      request['Authorization'] = @auth_header
      request['X-Identity'] = @pub_key
    end
    process_request(request)
  end

  def delete(path:, token: nil)
    urlpath = '/' + path
    urlpath = urlpath + '?token=' + token if token
    request = Net::HTTP::Delete.new urlpath
    request['Authorization'] = @auth_header
    request['X-Identity'] = @pub_key
    process_request(request)
  end

  private

  ## Processes HTTP Request and returns parsed response
  # Otherwise throws error
  #
  def process_request(request)
    request['User-Agent'] = @user_agent
    request['Content-Type'] = 'application/json'
    request['X-BitPay-Plugin-Info'] = 'Rubylib'

    begin
      response = @https.request request
    rescue => error
      raise StandardError, "Connection Error: #{error.message}"
    end

    if response.kind_of? Net::HTTPSuccess
      return JSON.parse(response.body)
    elsif JSON.parse(response.body)["error"]
      raise(StandardError, "#{response.code}: #{JSON.parse(response.body)['error']}")
    else
      raise StandardError, "#{response.code}: #{JSON.parse(response.body)}"
    end

  end

  ## Fetches the tokens hash from the server and
  #  updates @tokens
  #
  def refresh_tokens
    response = get(path: 'tokens')["data"]
    token_array = response || {}
    tokens = {}
    token_array.each do |t|
      tokens[t.keys.first] = t.values.first
    end
    @tokens = tokens
    return tokens
  end

  ## Makes a request to /tokens for pairing
  #     Adds passed params as post parameters
  #     If empty params, retrieves server-generated pairing code
  #     If pairingCode key/value is passed, will pair client ID to this account
  #   Returns response hash
  #

  def get_token(facade)
    token = @tokens[facade] || refresh_tokens[facade] || raise(StandardError, "Not authorized for facade: #{facade}")
  end
end