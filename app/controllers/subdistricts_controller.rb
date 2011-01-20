class SubdistrictsController < ApplicationController
  def index
    @district = District.find(params[:district_id])
    @subdistricts = @district.subdistricts
  end
end
