require 'json'
require 'open-uri'
require 'district_parser'
require 'geocoder_processor'
include GeocoderProcessor

namespace :recycle_bin do
  desc "Parse recycle bin pdf document provided by fehd.gov.hk"
  task :parse_location => :environment do
    districts = District.all
    raise "no district exists. please run db:seed to create the default districts." if districts.empty?
        
    cleanup_data
    
    [:hk, :kln, :nt, :is].each { |prefix|
      Dir["doc/fehd.gov.hk/#{prefix}_*.txt"].each {|entry|
        DistrictParser.parse(districts_by_prefix(districts, prefix), entry)
      }
    }
  end
  
  desc "Translate address into latitude and longitude using Google Web Services"
  task :google_geocode => :environment do
    (RecycleBin.find :all).each do |recycle_bin|
      # p "\nRecycle Bin Chinese Address: #{recycle_bin.add}"
      # p "Recycle Bin English Address: #{recycle_bin.add_eng}"
      GeocoderProcessor.multiple_dimension_search(recycle_bin)
    end # end each store
  end # end rake task
end

# i dont want to store the short prefix name into db ...
# meaningless to other modules
def districts_by_prefix(districts, prefix)
  name_eng = case prefix
  when :hk
    "Hong Kong Island"
  when :kln
    "Kowloon"
  when :nt
    "New Territories"
  when :is
    "Islands"
  else
    nil
  end
  
  districts.select{|district| district.name_eng == name_eng}.first if name_eng
end

def cleanup_data
  Subdistrict.destroy_all
  RecycleBin.destroy_all
end