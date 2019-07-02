# frozen_string_literal: true

require 'rails_helper'

describe AccountFinderConcern do
  describe 'local finders' do
    before do
      @account = Fabricate(:account, username: 'Alice')
    end

    describe '.find_local' do
      it 'returns case-insensitive result' do
        expect(Account.find_local('alice')).to eq(@account)
      end

      it 'returns correctly cased result' do
        expect(Account.find_local('Alice')).to eq(@account)
      end

      it 'returns nil without a match' do
        expect(Account.find_local('a_ice')).to be_nil
      end

      it 'returns nil for regex style username value' do
        expect(Account.find_local('al%')).to be_nil
      end

      it 'returns nil for nil username value' do
        expect(Account.find_local(nil)).to be_nil
      end

      it 'returns nil for blank username value' do
        expect(Account.find_local('')).to be_nil
      end
    end

    describe '.find_local!' do
      it 'returns matching result' do
        expect(Account.find_local!('alice')).to eq(@account)
      end

      it 'raises on non-matching result' do
        expect { Account.find_local!('missing') }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it 'raises with blank username' do
        expect { Account.find_local!('') }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it 'raises with nil username' do
        expect { Account.find_local!(nil) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end

  describe 'remote finders' do
    before do
      @account = Fabricate(:account, username: 'Alice', domain: 'gab.com')
    end

    describe '.find_remote' do
      it 'returns exact match result' do
        expect(Account.find_remote('alice', 'gab.com')).to eq(@account)
      end

      it 'returns case-insensitive result' do
        expect(Account.find_remote('ALICE', 'GAB.COM')).to eq(@account)
      end

      it 'returns nil when username does not match' do
        expect(Account.find_remote('a_ice', 'gab.com')).to be_nil
      end

      it 'returns nil when domain does not match' do
        expect(Account.find_remote('alice', 'g_b.com')).to be_nil
      end

      it 'returns nil for regex style domain value' do
        expect(Account.find_remote('alice', 'm%')).to be_nil
      end

      it 'returns nil for nil username value' do
        expect(Account.find_remote(nil, 'domain')).to be_nil
      end

      it 'returns nil for blank username value' do
        expect(Account.find_remote('', 'domain')).to be_nil
      end
    end

    describe '.find_remote!' do
      it 'returns matching result' do
        expect(Account.find_remote!('alice', 'gab.com')).to eq(@account)
      end

      it 'raises on non-matching result' do
        expect { Account.find_remote!('missing', 'gab.host') }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it 'raises with blank username' do
        expect { Account.find_remote!('', '') }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it 'raises with nil username' do
        expect { Account.find_remote!(nil, nil) }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
