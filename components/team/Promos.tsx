import { LetterAvatar } from '@/components/shared';
import { defaultHeaders } from '@/lib/common';
import { Team } from '@prisma/client';
import useTeams from 'hooks/useTeams';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from 'react-daisyui';
import toast from 'react-hot-toast';
import type { ApiResponse } from 'types';
import { useRouter } from 'next/router';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { WithLoadingAndError } from '@/components/shared';
import { CreateTeam } from '@/components/team';
import { Table } from '@/components/shared/table/Table';

const Promos = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [team, setTeam] = useState<Team | null>(null);
  const { isLoading, isError, teams, mutateTeams } = useTeams();
  const [askConfirmation, setAskConfirmation] = useState(false);
  const [createTeamVisible, setCreateTeamVisible] = useState(false);

  const { newTeam } = router.query as { newTeam: string };

  useEffect(() => {
    if (newTeam) {
      setCreateTeamVisible(true);
    }
  }, [newTeam]);

  const leaveTeam = async (team: Team) => {
    const response = await fetch(`/api/teams/${team.slug}/members`, {
      method: 'PUT',
      headers: defaultHeaders,
    });
    const json = (await response.json()) as ApiResponse;
    if (!response.ok) {
      toast.error(json.error.message);
      return;
    }
    toast.success(t('leave-team-success'));
    mutateTeams();
  };

  return (
    <WithLoadingAndError isLoading={isLoading} error={isError}>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <h2 className="text-xl font-medium leading-none tracking-tight">
              All Promos
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All your promos will be listed here
            </p>
          </div>
          <Button
            color="primary"
            size="md"
            onClick={() => setCreateTeamVisible(!createTeamVisible)}
          >
            New Promo
          </Button>
        </div>

        <Table
          cols={[
            t('name'), 
            "Status", 
            "Launched",
            t('actions')
          ]}
          body={
            teams
              ? teams.map((team) => {
                  return {
                    id: team.id,
                    cells: [
                      {
                        wrap: true, text: "Here we are, remix"
                      },{ 
                        wrap: true, text: "Launched"
                      },{
                        wrap: true,
                        text: new Date(team.createdAt).toDateString(),
                      },{
                        buttons: [
                          {
                            color: 'error',
                            text: "Go offline",
                            onClick: () => {
                              setTeam(team);
                              setAskConfirmation(true);
                            },
                          },
                        ],
                      },
                    ],
                  };
                })
              : []
          }
        ></Table>

        <ConfirmationDialog
          visible={askConfirmation}
          title={`${t('leave-team')} ${team?.name}`}
          onCancel={() => setAskConfirmation(false)}
          onConfirm={() => {
            if (team) {
              leaveTeam(team);
            }
          }}
          confirmText={t('leave-team')}
        >
          {t('leave-team-confirmation')}
        </ConfirmationDialog>
        <CreateTeam
          visible={createTeamVisible}
          setVisible={setCreateTeamVisible}
        />
      </div>
    </WithLoadingAndError>
  );
};

export default Promos;
