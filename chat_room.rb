require 'sinatra/base'
require 'sinatra/sse'
require 'redis'
require 'oj'

class ChatRoom < Sinatra::Base
  include Sinatra::SSE

  set :connections, []
  set :redis_url , 'redis://localhost:6379'
  set :server, 'thin'

  get '/' do
    erb :index
  end

  get '/room/:room_id/message' do   
    redis = Redis.new(url: settings.redis_url)
    room = 'room_' + params[:room_id]
    sse_stream do |out|
      settings.connections << out
      out.callback {
        settings.connections.delete(out)
      }
      redis.subscribe(room) do |on|
        on.message do |room, message|
          out.push({id: Time.now.to_s, event: 'message', data: message})
        end
      end
    end
  end

  post '/room/:room_id/message' do 
    redis = Redis.new(url: settings.redis_url)
    room = 'room_' + params[:room_id]
    redis.publish(room, params[:message])
    status 200
  end

end
