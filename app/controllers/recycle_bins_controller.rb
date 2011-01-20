class RecycleBinsController < ApplicationController
  def index
    @subdistrict = Subdistrict.find(params[:subdistrict_id])
    @recycle_bins = @subdistrict.recycle_bins
  end
end
