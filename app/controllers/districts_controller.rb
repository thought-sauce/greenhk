class DistrictsController < ApplicationController
  def index
    @districts = District.all
  end
end
