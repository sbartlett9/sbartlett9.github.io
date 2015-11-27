delete from dirty_and_clean_together;

insert into dirty_and_clean_together

select i.committee_name as DonorOrganization, i.candidate_name as RecipientCandidateNameNormalized, 
        i.candidate_id_checked as RecipientCandidateFECID,'PAC' as DonorEntityType, sum(i.expenditure_amount) as Total, l.govtrack_id as govtrack_id, 'dark' as type
from legislators l
join independent_expenditures i on i.candidate_id_checked = l.fec_id
and support_oppose_checked = 'S'
group by i.committee_name, l.govtrack_id

union

select i.committee_name as DonorOrganization, i.candidate_name as RecipientCandidateNameNormalized, 
        i.candidate_id_checked as RecipientCandidateFECID,'PAC' as DonorEntityType, sum(i.expenditure_amount) as Total, l.govtrack_id as govtrack_id, 'dark indirect' as type
from legislators l
join independent_expenditures i on l.district = i.district_checked
and l.fec_id != i.candidate_id_checked
and i.support_oppose_checked = 'O'
group by i.committee_name, l.govtrack_id

union 

select o.*, 'light' as type from org_senate_contributions o;