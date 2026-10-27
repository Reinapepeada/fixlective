CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS failure_cases (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), brand VARCHAR(50) NOT NULL, model_commercial VARCHAR(100) NOT NULL,
 model_number VARCHAR(50), symptom VARCHAR(150) NOT NULL, current_draw VARCHAR(100), equipment_status VARCHAR(50),
 confirmations_count INTEGER NOT NULL DEFAULT 0 CHECK (confirmations_count >= 0), author VARCHAR(100),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS causes (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), case_id UUID NOT NULL REFERENCES failure_cases(id) ON DELETE CASCADE,
 component_or_zone VARCHAR(100) NOT NULL, description TEXT, is_confirmed BOOLEAN NOT NULL DEFAULT false, result_post VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS measurements (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), cause_id UUID NOT NULL REFERENCES causes(id) ON DELETE CASCADE,
 point_or_line VARCHAR(100) NOT NULL, type VARCHAR(50) NOT NULL CHECK(type IN ('diode','voltage','current','resistance')),
 powered BOOLEAN NOT NULL DEFAULT false, fault_value VARCHAR(50) NOT NULL, unit VARCHAR(20), normal_value VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS confirmations (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), case_id UUID NOT NULL REFERENCES failure_cases(id) ON DELETE CASCADE,
 type VARCHAR(50) NOT NULL CHECK(type IN ('also_happened','solution_confirmed')), user_id VARCHAR(100),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_failure_cases_search ON failure_cases(model_commercial,symptom);
CREATE INDEX IF NOT EXISTS idx_causes_case_id ON causes(case_id);
CREATE INDEX IF NOT EXISTS idx_measurements_cause_id ON measurements(cause_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_case_id ON confirmations(case_id);
CREATE OR REPLACE FUNCTION sync_confirmations_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
 IF TG_OP='INSERT' THEN UPDATE failure_cases SET confirmations_count=confirmations_count+1 WHERE id=NEW.case_id; RETURN NEW;
 ELSIF TG_OP='DELETE' THEN UPDATE failure_cases SET confirmations_count=confirmations_count-1 WHERE id=OLD.case_id; RETURN OLD;
 ELSE
  IF OLD.case_id IS DISTINCT FROM NEW.case_id THEN
   UPDATE failure_cases SET confirmations_count=confirmations_count-1 WHERE id=OLD.case_id;
   UPDATE failure_cases SET confirmations_count=confirmations_count+1 WHERE id=NEW.case_id;
  END IF;
  RETURN NEW;
 END IF;
END $$;
DROP TRIGGER IF EXISTS trg_sync_confirmations ON confirmations;
CREATE TRIGGER trg_sync_confirmations AFTER INSERT OR DELETE OR UPDATE OF case_id ON confirmations
FOR EACH ROW EXECUTE FUNCTION sync_confirmations_count();
