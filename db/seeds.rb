# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

District.create!(:name => "新界",  :name_eng => "New Territories")
District.create!(:name => "九龍",  :name_eng => "Kowloon")
District.create!(:name => "香港島", :name_eng => "Hong Kong Island")
District.create!(:name => "離島",  :name_eng => "Islands")